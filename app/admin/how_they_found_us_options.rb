ActiveAdmin.register HowTheyFoundUsOption do
  permit_params :name, :spanish_name, :for_volunteer, :for_client
  index do
    selectable_column
    id_column
    column :updated_at
    column :created_at
    actions
  end

  filter :name
  filter :spanish_name
  filter :for_volunteer
  filter :for_client
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :spanish_name
      f.input :for_volunteer, :input_html => { :checked => 'checked' }
      f.input :for_client, :input_html => { :checked => 'checked' }
    end
    f.actions
  end
end
