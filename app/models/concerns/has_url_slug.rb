require 'active_support/concern'
require 'digest'

module HasUrlSlug
  extend ActiveSupport::Concern

  included do
    before_validation :generate_url_slug, if: ->{ self.new_record? || self.url_slug.blank? }

    validates :url_slug, presence: true, format: { with: /\A[a-z0-9\-]+\z/}
    validates_uniqueness_of :url_slug

    def generate_url_slug(force: false)
      return unless self.url_slug.blank? || force

      label = generate_label

      if label.present?
        # We check to see if the slug is entirely made up of integer values
        # and then convert it to the word equivalent

        if self.class.consists_of_only_numbers?(label)
          slug_as_integer = label.strip.to_i
          base_slug = slug_as_integer.humanize
        else
          base_slug = label
        end

        base_slug = Digest::SHA1.hexdigest base_slug
        counter = 1
        salt = rand(0..9)
        slug = base_slug + salt.to_s

        while self.class.where(url_slug: slug).where.not(id: self.id).exists?
          counter += 1

          slug = base_slug + counter.to_s
        end

        self.update(:url_slug => slug)
      end
    end

    def regenerate_url_slug!(force = false)
      generate_url_slug(force: force)

      self.save!
    end

    protected

    def generate_label
      field = if self.methods.include?(:field_used_for_url_slug)
                self.field_used_for_url_slug
              else
                self.class.field_used_for_url_slug
              end
      self.send(field)
    end
  end

  module ClassMethods
    def field_used_for_url_slug
      :name || :email
    end

    def find_by_identifier!(identifier)
      raise ActiveRecord::RecordNotFound unless identifier.present?

      if consists_of_only_numbers?(identifier)
        self.find(identifier)
      else
        self.where(url_slug: identifier).first!
      end
    end

    def find_by_identifier(identifier)
      return false unless identifier.present?

      if consists_of_only_numbers?(identifier)
        self.where(id: identifier).first
      else
        self.where(url_slug: identifier).first
      end
    end

    def consists_of_only_numbers?(string)
      begin
        Integer(string)
      rescue ArgumentError
        false
      else
        true
      end
    end
  end
end
