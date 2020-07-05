ActiveAdmin.register Conversation do
  permit_params :author_id,
      :recipient_id

  filter :author_id
  filter :recipient_id
  filter :updated_at
  filter :created_at

  actions :all, :except => [:edit]

  controller do
    def action_methods
      if current_user.owner?
        super
      else
        super - ['destroy', 'new', 'edit']
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
end
