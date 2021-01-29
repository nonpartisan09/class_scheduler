module Contexts
  module Users
    class Creation
      def initialize(user, resource_name, role_id, programs, languages, main_goals, meeting_options)
        @user = user
        @resource_name = resource_name
        @role_id = role_id
        @programs = programs
        @languages = languages
        @main_goals = main_goals
        @meeting_options = meeting_options

        if check_if_email_exists?
          message = I18n.t('custom_errors.messages.email_in_use')
          raise Users::Errors::AlreadyUsedEmail, message
        end

        if check_t_and_c_unticked?
          message = I18n.t('custom_errors.messages.agree_to_terms_and_conditions')
          raise Users::Errors::AcceptTermsAndConditions, message
        end

      end

      def execute
        @user.terms_and_conditions = TermsAndConditions.last.id
        role = Role.find(@role_id)
        @user.roles << role
        @user.active = role.url_slug != 'volunteer'

        build_programs

        build_languages

        build_main_goals(role.url_slug)

        build_meeting_options

        @user.save!

        yield @user if block_given?

        send_welcome_email

        @user
      end

      private

      def build_programs
        @programs.each do |program|
          english_program = Program.find_by(name: program) 
          spanish_program = Program.find_by(spanish_name: program) 

          user_program = english_program ? english_program : spanish_program
          @user.programs << user_program
        end
      end

      def build_languages
        @languages.each do |language|
          @user.languages << Language.find_by_name(language)
        end
      end

      def build_main_goals(role)
        @main_goals.each do |main_goal|
          goal = main_goal.titlecase
          english_goal = MainGoal.find_by(name: goal, for_volunteer: isVolunteer(role), for_client: isClient(role)) 
          spanish_goal = MainGoal.find_by(spanish_name: goal, for_volunteer: isVolunteer(role), for_client: isClient(role))

          
          # If value is not found in
          unless english_goal || spanish_goal
            # create main goal record in db
            @user.main_goals.new(
              name: goal,
              spanish_name: goal, 
              for_volunteer: isVolunteer(role), 
              for_client: isClient(role), 
              displayable: false )
          else
            user_goal = english_goal ? english_goal : spanish_goal
            @user.main_goals << user_goal
          end
        end
      end

      def build_meeting_options
        @meeting_options.each do |option|
          option = option.titlecase
          english_option = MeetingOption.find_by(name: option)
          spanish_option = MeetingOption.find_by(spanish_name: option)
          
          # If value is not found in
          unless english_option || spanish_option
            # create main goal record in db
            @user.meeting_options.new(
              name: option,
              spanish_name: option, 
               displayable: false )
          else
            user_option = english_option ? english_option : spanish_option
            @user.meeting_options << user_option
          end
        end
      end

      def isVolunteer(role) 
        role == 'volunteer'
      end
      def isClient(role)
        role == 'client'
      end

      def send_welcome_email
        if @user.volunteer?
          UserMailer.volunteer_welcome_email(@user).deliver_later
        elsif @user.client?
          UserMailer.client_welcome_email(@user).deliver_later
        end
      end

      def check_t_and_c_unticked?
        @user.terms_and_conditions = false
      end

      def check_if_email_exists?
        User.where(:email => @user.email).exists?
      end

    end
  end
end
