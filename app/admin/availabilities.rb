ActiveAdmin.register Availability do
  permit_params :day,
      :start_time,
      :end_time,
      :created_at,
      :updated_at,
      :id,
      :user_id

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
    column :user_id do |availability|
      link_to User.find(availability[:user_id]).email, admin_user_path(availability[:user_id])
    end
    column :day
    column :start_time
    column :end_time
    column :updated_at
    column :created_at
    actions
  end

  filter :user_id, as: :select, collection: proc { User.volunteers.order(email: :asc).pluck(:email, :id) }
  filter :day
  filter :start_time
  filter :end_time
  filter :updated_at
  filter :created_at

  form do |f|
    f.inputs do
      f.input :user_id, as: :select, collection: User.all.pluck(:email, :id)
      f.input :day, as: :select, collection: Date::DAYNAMES
      f.input :start_time
      f.input :end_time
    end
    f.actions
  end
end
