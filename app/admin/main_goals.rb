ActiveAdmin.register MainGoal do
  permit_params :name,
      :spanish_name,
      :id,
      :created_at,
      :updated_at,
      :displayable,
      :for_volunteer,
      :for_client
  
  actions :all

  controller do
    def action_methods
      if current_user.admins_readonly?
        super - ['destroy', 'new', 'edit']
      else
        super
      end
    end
  end

  index do
    selectable_column
    id_column
    column :name
    column :spanish_name
    column :updated_at
    column :created_at
    column :displayable
    column :for_volunteer
    column :for_client
    actions
  end

  scope :all, default: true
  scope :displayable, proc { MainGoal.displayable }
  scope :volunteer_options, proc { MainGoal.volunteer_options }
  scope :client_options, proc { MainGoal.client_options }

  filter :name
  filter :spanish_name
  filter :displayable
  filter :for_volunteer
  filter :for_client
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :spanish_name
      f.input :displayable
      f.input :for_volunteer
      f.input :for_client
      end
    f.actions
  end
end