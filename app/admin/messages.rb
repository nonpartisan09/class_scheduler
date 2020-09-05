ActiveAdmin.register Message do
  permit_params :user_id,
      :body,
      :subject,
      :unread,
      :id

  filter :subject
  filter :body
  filter :unread
  filter :user_id
  filter :updated_at
  filter :created_at

  index do
    id_column
    column :subject
    column :body
    column :unread
    column :user_id
    column :updated_at
    column :created_at
    column :is_timely? do |message|
      message.conversation.is_timely?
    end
    actions
  end

  actions :all, :except => [:edit]

  controller do
    def action_methods
      if current_user.admins_readonly?
        super - ['destroy', 'new', 'edit']
      else
        super
      end
    end
  end
end
