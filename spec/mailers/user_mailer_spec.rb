require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  describe 'When a user signs up' do
    let(:user) { FactoryGirl.create(:user) }
    let(:mail) { UserMailer.welcome_email(user) }

    it 'renders the headers' do
      expect(mail.subject).to eq('Welcome to tutoría')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['no-reply@tutoria.com'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include("You have successfully signed up to tutor=C3=ADa.com as a user")
    end
  end
end
