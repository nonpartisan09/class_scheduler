ActiveAdmin.register OccupationTypeOption do
  permit_params :name, :spanish_name
  index do
    selectable_column
    id_column
    column :name
    column :updated_at
    column :created_at
    actions
  end

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

  filter :name
  filter :spanish_name
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :spanish_name
    end
    f.actions
  end
end
