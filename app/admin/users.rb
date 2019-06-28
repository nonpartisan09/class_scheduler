ActiveAdmin.register User do
  controller do
    def create
      user = build_resource
      user.admin_user_creation!
      redirect_to(admin_user_path(user))
    end
    def update
      @active = User.find(params[:id]).try(:active)
      super
      if @user.active == true
        # send email here
        resource.activate_account!
      else
        resource.deactivate_account!
      end
    end
  end

  permit_params :email,
      :active,
      :address,
      :average_rating,
      :city,
      :contact_permission,
      :country,
      :created_at,
      :description,
      :email_notification,
      :first_name,
      :how_they_found_us,
      :id,
      :last_name,
      :last_sign_in_at,
      :locale,
      :phone_number,
      :state,
      :terms_and_conditions,
      :timezone,
      :updated_at,
      :url_slug,
      language_ids: [],
      languages: [ :id, :name ],
      program_ids: [],
      programs: [ :id, :name ],
      reviews: [ :id, :description, :review ],
      role_ids: [],
      roles: [ :id, :name ]

  scope :all, default: true
  scope :active, proc { User.active }
  scope :volunteers, proc { User.volunteers }
  scope :clients, proc { User.clients }
  scope :admins, proc { User.admins }

  member_action :impersonate, method: :put  do
    sign_in(:user, resource, { :bypass => true })
    redirect_to root_path
  end

  member_action :deactivate_user, method: :put do
    resource.deactivate_account!

    redirect_to(admin_user_path(resource))
  end

  member_action :delete_user_with_email, method: :put do
    resource.delete_with_email!

    redirect_to(admin_users_path)
  end

  member_action :reactivate_user, method: :put do
    resource.activate_account!
    redirect_to(admin_user_path(resource))
  end

  config.add_action_item(:delete_user, only: :show) do
    if resource.active
      link_to 'Delete User with email', delete_user_with_email_admin_user_path(resource), method: :put
    end
  end


  config.add_action_item(:impersonate, only: :show) do
    if resource.active
      link_to 'Impersonate User', impersonate_admin_user_path(resource), method: :put
    end
  end

  config.add_action_item(:deactivate_user, only: :show) do
    if resource.active
      link_to 'Deactivate User', deactivate_user_admin_user_path(resource), method: :put
    else
      link_to 'Reactivate User', reactivate_user_admin_user_path(resource), method: :put
    end
  end

  csv do
    column :email
    column :phone_number
    column :first_name
    column :last_name
    column :url_slug
    column :active
    column :contact_permission
    column :email_notification
    column :how_they_found_us
    column :address
    column :city
    column :locale
    column :description
    column :state
    column :country
    column :timezone
    column :average_rating
    column :current_sign_in_ip
    column :current_sign_in_at
    column :last_sign_in_ip
    column :last_sign_in_at
    column :created_at
    column :updated_at

    column :roles do |user|
      user.roles.each do |role|
          role[:name]
        end
      end

    column :languages do |user|
      user.languages.each do |language|
        language[:name]
      end
    end

    column :programs do |user|
      user.programs.each do |program|
        program[:name]
      end
    end
  end

  index do
    selectable_column
    id_column
    column :email
    column :active
    column :current_sign_in_at
    column :sign_in_count
    column :created_at
    column :average_rating
    actions
  end

  filter :email
  filter :current_sign_in_at
  filter :sign_in_count
  filter :created_at
  filter :updated_at
  filter :last_sign_in_at
  filter :contact_permission
  filter :average_rating

  show do
    tabs do
      tab 'Details' do
        attributes_table do
          row :thumbnail do
            img src: user.thumbnail_image.url(:thumbnail), class: 'admin-app-thumbnail' if user.thumbnail_image.present?
          end
          row :email
          row :phone_number
          row :first_name
          row :last_name
          row :url_slug
          row :terms_and_conditions, div do
            if resource.terms_and_conditions.present?
              link_to "Agreed upon T&Cs", admin_terms_and_condition_path(resource.terms_and_conditions)
            end
          end
          row :active
          row :locale
          row :contact_permission
          row :email_notification
          row :how_they_found_us
          row :address
          row :city
          row :description
          row :state
          row :country
          row :timezone
          row :average_rating
          row :current_sign_in_ip
          row :current_sign_in_at
          row :last_sign_in_ip
          row :last_sign_in_at
          row :created_at
          row :updated_at

          row :roles, div do |user|
            ul do user.roles.each do |role|
              li link_to role[:name]
              end
            end
          end

          row :languages, div do |user|
            ul do user.languages.each do |language|
              li link_to language[:name]
            end
            end
          end

          row :programs, div do |user|
            ul do user.programs.each do |program|
              li link_to program[:name]
            end
            end
          end
        end
      end

      tab 'Received Reviews' do
        table_for resource.received_reviews do
          column "Reviewer" do |review|
              link_to User.find(review[:author_id]).email, admin_user_path(review[:author_id])
          end
          column "Review rating" do |review|
            review[:review]
          end
          column "Comment" do |review|
            review[:comment]
          end
        end
      end

      tab 'Authored Reviews' do
        table_for resource.authored_reviews do
          column "Reviewee" do |review|
            link_to User.find(review[:user_id]).email, admin_user_path(review[:user_id])
          end
          column "Review rating" do |review|
            review[:review]
          end
          column "Comment" do |review|
            review[:comment]
          end
        end
      end
    end
  end

  form do |f|
    f.inputs do
      f.semantic_errors *f.object.errors.keys
      f.input :email
      f.input :phone_number
      f.input :first_name
      f.input :last_name
      f.input :description
      f.input :email_notification
      f.input :contact_permission
      f.input :how_they_found_us
      f.input :address
      f.input :locale
      f.input :city
      f.input :state
      f.input :active
      f.input :country, :as => :string
      f.input :timezone, collection: ActiveSupport::TimeZone.all.map(&:name), selected: resource.timezone
      roles_collection = Role.all.collect{|role| [role.name, role.id, { checked: resource.roles.include?(role) } ]}
      f.input :roles, as: :check_boxes, collection: roles_collection
      languages_collection = Language.all.collect{|language| [language.name, language.id, { checked: resource.languages.include?(language) } ]}
      f.input :languages, as: :check_boxes, collection: languages_collection
      programs_collection = Program.all.collect{|program| [program.name, program.id, { checked: resource.programs.include?(program) } ]}
      f.input :programs, as: :check_boxes, collection: programs_collection
    end
    f.actions
  end

end
