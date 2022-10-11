require 'test_helper'

class Web::PasswordsControllerTest < ActionController::TestCase
  test 'should get new' do
    get :new
    assert_response :success
  end

  test 'should get edit' do
    user = create(:user)
    PasswordResetService.create_password_reset_token!(user)

    get :edit, params: { token: user.reset_token }

    assert_response :success
  end

  test 'should not get edit if token has expired' do
    user = create(:user)
    PasswordResetService.create_password_reset_token!(user)

    travel 24.hours + 1.second

    get :edit, params: { token: user.reset_token }

    assert_redirected_to new_password_path
  end
end
