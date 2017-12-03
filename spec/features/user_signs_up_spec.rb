require 'rails_helper'

feature 'User signs up' do
  let!(:client_role) { create(:role) }
  let!(:volunteer_role) { create(:role, :name => 'Volunteer') }
  let!(:t_and_c) { create(:terms_and_conditions) }

  pending describe 'as a client' do
    it 'all fields should be present and required' do
      visit "/sign_up/#{client_role.url_slug}"

      expect(find('.email')[:required]).to_not be_nil
      expect(find_field('user_first_name')[:required]).to_not be_nil
      expect(find_field('user_password')[:required]).to_not be_nil
      expect(find_field('user_password_confirmation')[:required]).to_not be_nil
      expect(find_field('user[terms_and_conditions]')[:required]).to_not be_nil
      expect(find_field('user[terms_and_conditions]')[:required]).to_not be_nil
    end

    describe 'and fill in all their details' do
      it 'they see their username on the homepage' do
        visit sign_up_path(client_role.url_slug)

        fill_in 'user_display_name', with: 'Username'
        fill_in 'user_first_name', with: 'FirstName'
        fill_in 'user_last_name', with: 'LastName'
        fill_in 'user_email', with: 'user@email.com'
        fill_in 'user_password', with: 'password123'
        fill_in 'user_password_confirmation', with: 'password123'

        check "user[terms_and_conditions]"
        click_button "Sign up"

        expect(current_path).to eql(root_path)
        expect(page).to have_selector('div.name', text: 'Username')
      end
    end
  end

  pending describe 'as a volunteer' do

    it 'all fields should be present and required' do
      visit sign_up_path(volunteer_role.url_slug)

      expect(find_field('user_display_name')[:required]).to_not be_nil
      expect(find_field('user_first_name')[:required]).to_not be_nil
      expect(find_field('user_last_name')[:required]).to_not be_nil
      expect(find_field('user_email')[:required]).to_not be_nil
      expect(find_field('user_password')[:required]).to_not be_nil
      expect(find_field('user_password_confirmation')[:required]).to_not be_nil
      expect(find_field('user[terms_and_conditions]')[:required]).to_not be_nil
    end

    describe 'and fill in all their details' do
      it 'they see their username on the homepage' do
        visit sign_up_path(volunteer_role.url_slug)

        fill_in 'user_display_name', with: 'Username'
        fill_in 'user_first_name', with: 'FirstName'
        fill_in 'user_last_name', with: 'LastName'
        fill_in 'user_email', with: 'user@email.com'
        fill_in 'user_password', with: 'password123'
        fill_in 'user_password_confirmation', with: 'password123'

        check "user[terms_and_conditions]"
        click_button "Sign up"

        expect(current_path).to eql(root_path)
        expect(page).to have_selector('div.name', text: 'Username')
      end
    end
  end
end

