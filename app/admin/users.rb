ActiveAdmin.register User do
  controller do
    def create
      user = build_resource
      user.admin_user_creation!
      redirect_to(admin_user_path(user))
    end

    def action_methods
      user = ''
      roles = []
      if params[:id]
        user = User.find(params[:id])
        roles = user.roles.map{|r| r.name}
      end
      
      # An action must always be returned in if statements or an error will be thrown.
      # All supers are needed.
      if current_user.admins_readonly?
        super - ['destroy', 'new', 'edit']
      elsif current_user.owner? == false
          #Check user's roles. 
          if roles.length > 0
             #Admin can edit/update their own profile
            if current_user.id === user.id 
              super 
             #Then Admin can only read the profile if user is an Owner or Admin. 
            elsif roles.include?("Owner") || roles.include?("Admin")
              super - ['destroy', 'edit']
            else 
              super 
            end
          else 
            super  
          end 
      else
        super
      end
    end
  end

  class ReadonlyInput < Formtastic::Inputs::StringInput
    def to_html
      input_wrapping do
        label_html <<
            template.content_tag('div', @object.send(method))
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
      :last_name,
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
      :is_over_18,
      :consented_to_background_check,
      :age_range,
      :education,
      :household_income,
      :occupation_type,
      :occupation,
      :timeout,
      language_ids: [],
      languages: [ :id, :name ],
      program_ids: [],
      programs: [ :id, :name ],
      reviews: [ :id, :description, :review ],
      role_ids: [],
      roles: [ :id, :name ],
      main_goal_ids: [],
      main_goals: [ :id, :name ],
      meeting_option_ids: [],
      meeting_options: [ :id, :name ],
      gender_identity_ids: [],
      gender_identities: [ :id, :name ],
      ethnicity_race_ids: [],
      ethnicity_races: [ :id, :name ]

  scope :all, default: true
  scope :active, proc { User.active }
  scope :volunteers, proc { User.volunteers }
  scope :clients, proc { User.clients }
  scope :admins, proc { User.admins }
  scope :admins_readonly, proc { User.admins_readonly }
  scope :owners, proc { User.owners }

  member_action :impersonate, method: :put  do
    if current_user.admins_readonly? == false 
      sign_in(:user, resource, { :bypass => true })
      redirect_to root_path
    end 
  end

  member_action :deactivate_user, method: :put do 
    if current_user.admins_readonly? == false 
      resource.deactivate_account!
      redirect_to(admin_user_path(resource))
    end 
  end

  member_action :delete_user_with_email, method: :put do
    roles = user.roles.map{|r| r.name}
    if current_user.owner? == false && (roles.include?('Owner') || roles.include?('Admin'))
      nil
    else 
      if current_user.admins_readonly? == false 
        resource.delete_with_email!
        redirect_to(admin_users_path)
      end 
    end
  end

  member_action :reactivate_user, method: :put do
    if current_user.owner? || current_user.admin?
      resource.activate_account!
      redirect_to(admin_user_path(resource))
    end
  end

  config.add_action_item(:delete_user, only: :show) do 
    roles = user.roles.map{|r| r.name}
    if resource.active
      if current_user.owner? == false && (roles.include?('Owner') || roles.include?('Admin'))
        nil
      else 
        if current_user.admins_readonly? == false 
          link_to 'Delete User with email', delete_user_with_email_admin_user_path(resource), method: :put
        end 
      end
    end
  end


  config.add_action_item(:impersonate, only: :show) do
    roles = user.roles.map{|r| r.name}
    if resource.active 
      if current_user.owner? == false && (roles.include?('Owner') || roles.include?('Admin'))
        nil
      else 
        if current_user.admins_readonly? == false 
          link_to 'Impersonate User', impersonate_admin_user_path(resource), method: :put
        end
      end
    end
  end

  config.add_action_item(:deactivate_user, only: :show) do
    roles = user.roles.map{|r| r.name}
    if resource.active
      if current_user.owner? == false && (roles.include?('Owner') || roles.include?('Admin'))
        nil 
      else 
        if current_user.admins_readonly? == false 
          link_to 'Deactivate User', deactivate_user_admin_user_path(resource), method: :put
        end
      end 
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
    column :education
    column :household_income
    column :occupation_type
    column :occupation
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

    column :main_goals do |user|
      user.main_goals.each do |goal|
        goal[:name]
      end
    end

    column :meeting_options do |user|
      user.meeting_options.each do |option|
        option[:name]
      end
    end

    column :gender_identities do |user|
      user.gender_identities.each do |gender|
        gender[:name]
      end
    end

    column :ethnicity_races do |user|
      user.ethnicity_races.each do |race|
        race[:name]
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
          row :is_over_18
          row :consented_to_background_check
          row :active
          row :locale
          row :contact_permission
          row :email_notification
          row :how_they_found_us
          row :education
          row :household_income
          row :occupation_type
          row('Occupation / Studying'){ |user| user.occupation }
          row :age_range
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

          row :main_goals, div do |user|
            ul do user.main_goals.each do |main_goal|
              li link_to main_goal[:name]
            end
            end
          end
          row :meeting_options, div do |user|
            ul do user.meeting_options.each do |option|
              li link_to option[:name]
            end
            end
          end

          row :gender_identities, div do |user|
            ul do user.gender_identities.each do |gender|
              li link_to gender[:name]
            end
            end
          end

          row :ethnicity_races, div do |user|
            ul do user.ethnicity_races.each do |race|
              li link_to race[:name]
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
      f.input :is_over_18
      f.input :consented_to_background_check
      f.input :email
      f.input :phone_number
      f.input :first_name
      f.input :last_name
      f.input :description
      f.input :email_notification
      f.input :contact_permission
      f.input :how_they_found_us, 
        :as => :select, :collection => HowTheyFoundUsOption.all.order('name').map{|option| [option.name]}
      f.input :education, 
        :as => :select, :collection => EducationOption.all.order('id ASC').map{|option| [option.name]}
      f.input :household_income, 
        :as => :select, :collection => HouseholdIncomeOption.all.order('name ASC').map{|option| [option.name]}
      f.input :occupation_type,
        :as => :select, :collection => OccupationTypeOption.all.order('id ASC').map{|option| [option.name]}
      f.input :occupation,  :label => 'Occupation / Studying'
      f.input :address
      f.input :locale
      f.input :city
      f.input :state
      f.input :active, as: :readonly
      f.input :country, :as => :string
      f.input :timezone, collection: ActiveSupport::TimeZone.all.map(&:name), selected: resource.timezone
      roles_collection = Role.all.collect{|role| [role.name, role.id, { checked: resource.roles.include?(role) }]}
      user = User.find(params[:id]) if params[:id]
      f.input :age_range
      
      if user && current_user.id == user.id && !current_user.owner?
        f.input :roles, as: :check_boxes, collection: roles_collection, :disabled => [ "Owner", 4]
      elsif current_user.admin? && current_user.owner? == false
        f.input :roles, as: :check_boxes, collection: roles_collection, :disabled => ["Owner", 4, "Admin", 1]
      else 
        f.input :roles, as: :check_boxes, collection: roles_collection
      end
    
      languages_collection = Language.all.collect{|language| [language.name, language.id, { checked: resource.languages.include?(language) } ]}
      f.input :languages, as: :check_boxes, collection: languages_collection
      programs_collection = Program.all.collect{|program| [program.name, program.id, { checked: resource.programs.include?(program) } ]}
      f.input :programs, as: :check_boxes, collection: programs_collection

      if resource.volunteer?
        main_goals_collection = MainGoal.where(for_volunteer: true).collect{|goal| [goal.name, goal.id, { checked: resource.main_goals.include?(goal) } ]}
      elsif resource.client?
        main_goals_collection = MainGoal.where(for_client: true).collect{|goal| [goal.name, goal.id, { checked: resource.main_goals.include?(goal) } ]}
      else
        main_goals_collection = MainGoal.all.order('displayable DESC, for_client DESC, name').collect{|goal| [goal.type.titlecase + goal.name, goal.id, { checked: resource.main_goals.include?(goal) }]}
      end
      
      f.input :main_goals, as: :select, input_html: { multiple: true }, collection: main_goals_collection

      meeting_options_collection = MeetingOption.all.collect{|option| [option.name, option.id, { checked: resource.meeting_options.include?(option) } ]}
      f.input :meeting_options, as: :select, input_html: { multiple: true }, collection: meeting_options_collection

      gender_identities_collection = GenderIdentity.all.collect{|gender| [gender.name, gender.id, { checked: resource.gender_identities.include?(gender) } ]}
      f.input :gender_identities, as: :select, input_html: { multiple: true }, collection: gender_identities_collection

      ethnicity_races_collection = EthnicityRace.all.collect{|race| [race.name, race.id, { checked: resource.ethnicity_races.include?(race) } ]}
      f.input :ethnicity_races, as: :select, input_html: { multiple: true }, collection: ethnicity_races_collection
    end
    f.actions
  end
  
end