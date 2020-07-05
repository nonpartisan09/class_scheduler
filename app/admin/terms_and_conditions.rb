ActiveAdmin.register TermsAndConditions do
  permit_params :description,
      :created_at,
      :updated_at,
      :id

  actions :all

  controller do
    def action_methods
      if current_user.owner?
        super
      else
        super - ['destroy', 'new', 'edit']
      end
    end
  end

  index do
    selectable_column
    id_column
    column :updated_at
    column :created_at
    actions
  end

  filter :description
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :description
    end
    f.actions
  end
end
