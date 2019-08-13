ActiveAdmin.register Program do
  permit_params :name,
      :spanish_name,
      :id,
      :url_slug,
      :description,
      :spanish_description,
      :created_at,
      :updated_at,
      :featured

  index do
    selectable_column
    id_column
    column :name
    column :spanish_name
    column :url_slug
    column :description
    column :spanish_description
    column :updated_at
    column :created_at
    column :featured
    actions
  end

  scope :all, default: true
  scope :featured, proc { Program.featured }

  filter :name
  filter :spanish_name
  filter :url_slug
  filter :description
  filter :spanish_description
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :spanish_name
      f.input :url_slug
      f.input :description
      f.input :spanish_description
      f.input :featured
    end
    f.actions
  end
end
