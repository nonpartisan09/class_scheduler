require 'rails_helper'

feature 'When user navigates to new availability page' do
  let!(:client_role) { create(:role) }
  let!(:volunteer_role) { create(:role, :name => 'Volunteer') }
  let! (:user) { create(:user, { :roles => [ client_role ]}) }

  pending describe 'and is not signed in' do
    it 'then they should be redirected to sign in page' do
      visit new_availability_path

      expect(current_path).to eql(sign_in_path)
      expect(page).to have_selector('h3.page-header__title', text: 'Sign In')
    end
  end

  pending describe 'and is signed in' do
    describe 'as a client' do
      before (:each) {
        visit sign_in_path
        fill_in 'user_email', with: user.email
        fill_in 'user_password', with: 'password'
        click_button "Log in"
        expect(current_path).to eql(root_path)
      }

      it 'then they are redirected to sign in' do

        visit new_availability_path

        expect(current_path).to eql(root_path)
        expect(page).to have_selector('div.name', text: user.display_name)
      end
    end

    describe 'as a volunteer' do
      before(:each) do
        @volunteer = create(:user, { :roles => [ volunteer_role ]})
        visit sign_in_path
        fill_in 'user_email', with: @volunteer.email
        fill_in 'user_password', with: 'password'
        click_button "Log in"
        expect(current_path).to eql(root_path)
      end

      it 'then all fields should be present and required' do
        visit new_availability_path

        expect(find('select#availability_timezone')).to_not be_nil
        expect(find_field('availability_day_monday')[:required]).to_not be_nil
        expect(find_field('availability_day_tuesday')[:required]).to_not be_nil
        expect(find_field('availability_day_wednesday')[:required]).to_not be_nil
        expect(find_field('availability_day_thursday')[:required]).to_not be_nil
        expect(find_field('availability_day_friday')[:required]).to_not be_nil
        expect(find_field('availability_day_saturday')[:required]).to_not be_nil
        expect(find_field('availability_day_sunday')[:required]).to_not be_nil
        expect(find_field('availability_start_time')[:required]).to_not be_nil
        expect(find_field('availability_end_time')[:required]).to_not be_nil
      end

      describe 'and fills in all the details correctly' do
        it 'then they are shown their full list of availabilities' do
          visit new_availability_path

          select 'Berlin', :from => 'availability_timezone'
          choose 'availability_day_tuesday'
          fill_in 'availability_start_time', with: '12:00'
          fill_in 'availability_end_time', with: '13:00'

          click_button "Create new availability"

          expect(current_path).to eql(availabilities_path)
          expect(page).to have_selector('h3.page-header__title', text: 'My availabilities')
          expect(page).to have_selector('.weekday', text: 'Tuesday')
          expect(page).to have_selector('.timezone', text: 'Berlin')
          expect(page).to have_selector('.start_time', text: '12:00')
          expect(page).to have_selector('.end_time', text: '13:00')
        end

        describe 'fills in some of the details incorrectly' do
          describe 'by choosing an end time before start time' do
            it 'then they are redirected to new availability with relevant error message' do
              visit new_availability_path

              select 'Berlin', :from => 'availability_timezone'
              choose 'availability_day_tuesday'
              fill_in 'availability_start_time', with: '04:00'
              fill_in 'availability_end_time', with: '01:00'

              click_button "Create new availability"

              expect(current_path).to eql(new_availability_path)
              expect(page).to have_selector('.error', text: 'Please select an end time chronologically after start time.')
            end
          end
          describe 'by choosing an availability inferior to 30 minutes' do
            it 'then they are redirected to new availability with relevant error message' do
              visit new_availability_path

              select 'Berlin', :from => 'availability_timezone'
              choose 'availability_day_tuesday'
              fill_in 'availability_start_time', with: '18:00'
              fill_in 'availability_end_time', with: '18:29'

              click_button "Create new availability"

              expect(current_path).to eql(new_availability_path)
              expect(page).to have_selector('.error', text: 'The minimum required for a class is 30 minutes.')
            end
          end
          describe 'by choosing an availability that overlaps with existing availability' do
            before(:each) do
              visit new_availability_path

              select 'Berlin', :from => 'availability_timezone'
              choose 'availability_day_tuesday'
              fill_in 'availability_start_time', with: '12:00'
              fill_in 'availability_end_time', with: '13:00'

              click_button "Create new availability"
            end

            it 'then they are redirected to new availability with error message' do
              visit new_availability_path

              select 'UTC', :from => 'availability_timezone'
              choose 'availability_day_tuesday'
              fill_in 'availability_start_time', with: '11:00'
              fill_in 'availability_end_time', with: '12:00'

              click_button "Create new availability"

              expect(current_path).to eql(new_availability_path)
              expect(page).to have_selector('.error', text: 'This would overlap with some of your existing availabilities. You might want to delete them and try again.')
            end
          end
        end
      end
    end
  end
end

