ActiveAdmin.register EthnicityRace do
  permit_params :name,
      :spanish_name,
      :id,
      :created_at,
      :updated_at,
      :displayable
  
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

    actions
  end

  scope :all, default: true
  scope :displayable, proc { GenderIdentity.displayable }

  filter :name
  filter :spanish_name
  filter :displayable
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :spanish_name
      f.input :displayable
      end
    f.actions
  end
end