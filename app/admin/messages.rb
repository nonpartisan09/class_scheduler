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

  actions :all, :except => [:edit]
end
