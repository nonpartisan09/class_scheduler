ActiveAdmin.register Conversation do
  permit_params :author_id,
      :recipient_id

  filter :author_id
  filter :recipient_id
  filter :updated_at
  filter :created_at
  actions :all, :except => [:edit]

  index do
    selectable_column
    id_column
    column :author_id do |conversation|
      link_to User.find(conversation[:author_id]).email, admin_user_path(conversation[:author_id])
    end
    column :recipient_id do |conversation|
      link_to User.find(conversation[:recipient_id]).email, admin_user_path(conversation[:recipient_id])
    end
    column "Timely" do |conversation|
      conversation.is_timely?
    end
    column :updated_at
    column :created_at
    actions
  end

  controller do
    def action_methods
      if current_user.admins_readonly?
        super - ['destroy', 'new', 'edit']
      else
        super
      end
    end
  end

  show do
    tabs do
      tab 'Messages' do
        table_for resource.messages do
          column "Message Subject" do |message|
            span message.subject
          end
          column "Message Body" do |message|
            span message.body
          end
          column "Message Author" do |message|
            user = User.find(message.user_id)
            link_to user.email, admin_user_path(message.user_id) if user.present?
          end
        end
      end
    end
  end

  csv do
    column :id
    column :author_id do |conversation|
      User.find(conversation[:author_id]).email
    end
    column :recipient_id do |conversation|
      User.find(conversation[:recipient_id]).email
    end
    column "timely" do |conversation| 
      User.find(conversation.recipient_id).timeout
    end
    column :updated_at
    column :created_at
  end
end
