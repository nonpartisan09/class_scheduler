ActiveAdmin.register Role do
  permit_params :name,
  :url_slug,
  :displayable,
  :description,
  :created_at,
  :updated_at,
  :id

  index do
    selectable_column
    id_column
    column :name
    column :displayable
    column :description
    column :updated_at
    column :created_at
    actions
  end

  filter :name
  filter :displayable
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :displayable
      f.input :description
    end
    f.actions
  end
end
