ActiveAdmin.register Program do
  permit_params :name,
      :id,
      :url_slug,
      :description,
      :created_at,
      :updated_at

  index do
    selectable_column
    id_column
    column :name
    column :url_slug
    column :description
    column :updated_at
    column :created_at
    column :featured
    actions
  end

  scope :all, default: true
  scope :featured, proc { Program.featured }

  filter :name
  filter :url_slug
  filter :description
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :url_slug
      f.input :description
      f.input :featured
    end
    f.actions
  end
end
