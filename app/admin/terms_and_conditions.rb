ActiveAdmin.register TermsAndConditions do
  permit_params :version,
      :description,
  :created_at,
  :updated_at,
  :id

  index do
    selectable_column
    id_column
    column :version
    column :updated_at
    column :created_at
    actions
  end

  filter :version
  filter :description
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :version
      f.input :description
    end
    f.actions
  end
end
