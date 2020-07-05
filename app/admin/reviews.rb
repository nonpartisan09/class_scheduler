ActiveAdmin.register Review do
  permit_params :author_id,
  :user_id,
  :review,
  :comment,
  :id

  filter :author_id
  filter :user_id
  filter :review
  filter :comment
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

  form do |f|
    f.inputs do
      f.semantic_errors *f.object.errors.keys
      f.input :author_id, as: :select, collection: User.all.pluck(:email, :id)
      f.input :user_id, as: :select, collection: User.all.pluck(:email, :id)
      f.input :review
      f.input :comment
    end
    f.actions
  end
end
