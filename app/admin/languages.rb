ActiveAdmin.register Language, :as => "all_language" do
  permit_params :name,
      :url_slug,
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
    column :name
    column :url_slug
    column :updated_at
    column :created_at
    actions
  end

  filter :name
  filter :url_slug
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :url_slug
    end
    f.actions
  end
end
