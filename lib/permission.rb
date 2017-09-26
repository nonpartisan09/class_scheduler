class Permission
  class Clause
    def initialize(subject)
      @subject = subject
    end

    def to(action, resource, options = {})
      return false unless @subject

      case resource
      when User
        assert_user_action(action, resource)
      when Symbol
        case resource
        when :user
          assert_user_action_from_id(action, options.fetch(:with_id, nil))
        else
          raise ArgumentError.new("No permissions set for resource type #{resource}")
        end
      else
        if resource.respond_to? :all?
          resource.all?{|resource_item| to(action, resource_item, options)}
        else
          raise ArgumentError.new("No permissions set for #{resource.class.name}")
        end
      end
    end

    private

    def assert_user_action(action, user)
      assert_user_action_from_id(action, user.id)
    end

    def assert_user_action_from_id(action, user_id)
      return false if user_id.blank?

      case action
      when :view, :update, :view_apps_belonging_to, :view_downloads_of, :view_purchases_of
        user_id == @subject.id || user_id == @subject.url_slug
      else
        false
      end
    end
  end

  def self.has_been_given_to(user)
    Permission::Clause.new(user)
  end
end
