require 'test_helper'

class Web::PasswordsControllerTest < ActionController::TestCase
  setup do
    @user = create(:user)
    PasswordResetService.create_password_reset_token!(@user)
    @edit_params = { token: @user.reset_token }
  end

  test 'should get new' do
    get :new
    assert_response :success
  end

  test 'should get edit' do
    get :edit, params: @edit_params

    assert_response :success
  end

  test 'should not get edit if token has expired' do
    travel 24.hours + 1.second

    get :edit, params: @edit_params

    assert_redirected_to new_password_path
  end
end
