require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  describe 'When a client user signs up' do
    let(:user) { FactoryBot.create(:client_user) }
    let(:mail) { UserMailer.client_welcome_email(user) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Welcome to Tutoría')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include("You have successfully signed up domainname as a client.")
    end
  end
  describe 'When a volunteer user signs up' do
    let(:user) { FactoryBot.create(:volunteer_user) }
    let(:mail) { UserMailer.volunteer_welcome_email(user) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Welcome to tutoría')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include("You have successfully created a volunteer account on domainname")
    end
  end
  describe 'When a user receives a new email' do
    let!(:user) { FactoryBot.create(:user) }
    let(:sender) { FactoryBot.create(:user) }
    let(:message) { FactoryBot.build(:message, { user: user }) }

    let(:mail) { UserMailer.new_message(user, sender, message) }

    it 'renders the headers' do
      expect(mail.subject).to eq("New message from: #{sender.first_name} - tutoría")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include(message[:body])
    end
  end
  describe 'When a user is deactivated' do
    let(:user) { FactoryBot.create(:user) }
    let(:mail) { UserMailer.account_deactivated(user) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Tutoría Account Disabled')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include("Your Tutor=C3=ADa account with username #{user[:email]} has been dis=\nabled by the administrator")
    end
  end
  describe 'When a user is reactivated' do
    let(:user) { FactoryBot.create(:user) }
    let(:mail) { UserMailer.account_reactivated(user) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Tutoría Account Re-enabled')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include("Your Tutor=C3=ADa account with username #{user[:email]} has been re-=\nenabled by the administrator")
    end
  end

  describe 'When a user is deleted' do
    let(:user) { FactoryBot.create(:user) }
    let(:mail) { UserMailer.account_deleted(user) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Tutoría Account Deleted')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include("Your Tutor=C3=ADa account with username #{user[:email]} has been del=\neted")
    end
  end

  describe 'When a user updates their password' do
    let(:user) { FactoryBot.create(:user) }
    let(:mail) { UserMailer.password_updated(user) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Tutoría Password Updated')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include("Your password has been updated.")
    end
  end

  describe 'When a volunteer user is unresponsive, the volunteer receives an email' do
    let(:volunteer) { FactoryBot.create(:user) }
    let(:client) { FactoryBot.create(:user) }
    let(:program) { FactoryBot.create(:program) }
    let(:conversation) { FactoryBot.build(:conversation, {author_id: client.id, recipient_id: volunteer.id}) }
    let(:mail) { UserMailer.unresponsive_volunteer(volunteer, client, conversation, program) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Untimely response to client message')
      expect(mail.to).to eq([volunteer.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include('we have deactivated your availabilities')
    end

    it 'renders the correct client name' do
      expect(mail.body.encoded).to include(client.first_name)
    end

    it 'renders the correct volunteer name' do
      expect(mail.body.encoded).to include(volunteer.first_name)
    end

    it 'renders the correct program name' do
      expect(mail.body.encoded).to include(program.name)
    end
  end

  describe 'When a volunteer is unresponsive, the client receives this email in english' do
    let(:volunteer) { FactoryBot.create(:user) }
    let(:client) { FactoryBot.create(:user) }
    let(:program) { FactoryBot.create(:program) }
    let(:conversation) { FactoryBot.build(:conversation, {author_id: client.id, recipient_id: volunteer.id}) }
    let(:mail) { UserMailer.unresponsive_client_eng(volunteer, client, conversation, program) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Volunteer Unavailable - Tutoría')
      expect(mail.to).to eq([client.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include('We apologize for the inconvenience.')
    end

    it 'renders the correct client name' do
      expect(mail.body.encoded).to include(client.first_name)
    end

    it 'renders the correct volunteer name' do
      expect(mail.body.encoded).to include(volunteer.first_name)
    end

    it 'renders the correct program name' do
      expect(mail.body.encoded).to include(program.name)
    end
  end

  describe 'When a volunteer is unresponsive, the client receives this email in spanish' do
    let(:volunteer) { FactoryBot.create(:user) }
    let(:client) { FactoryBot.create(:user) }
    let(:program) { FactoryBot.create(:program) }
    let(:conversation) { FactoryBot.build(:conversation, {author_id: client.id, recipient_id: volunteer.id}) }
    let(:mail) { UserMailer.unresponsive_client_esp(volunteer, client, conversation, program) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Voluntario/a no disponible - Tutoría')
      expect(mail.to).to eq([client.email])
      expect(mail.from).to eq(['no-reply@tutoria.io'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include('Lamentamos el inconveniente y le ofrecemos las siguientes')
    end

    it 'renders the correct client name' do
      expect(mail.body.encoded).to include(client.first_name)
    end

    it 'renders the correct volunteer name' do
      expect(mail.body.encoded).to include(volunteer.first_name)
    end

    it 'renders the correct program name' do
      expect(mail.body.encoded).to include(program.name)
    end
  end
end
