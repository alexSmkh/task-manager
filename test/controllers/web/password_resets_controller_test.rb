require 'test_helper'

class Web::PasswordResetsControllerTest < ActionController::TestCase
  setup do
    @user = create(:user)
    PasswordResetService.create_password_reset_token!(@user)
    password = (1..8).to_a.join
    @update_params = {
      new_password_form: {
        password: password,
        password_confirmation: password,
        reset_token: @user.reset_token,
      },
    }
  end

  test 'should create token and send email' do
    attrs = { email: @user.email }

    assert_emails(1) { post :create, params: { password_reset_form: attrs } }
    assert_redirected_to root_path
  end

  test 'should update password' do
    patch :update, params: @update_params

    assert_redirected_to new_session_path
  end

  test 'should not update password twice by one token' do
    patch :update, params: @update_params

    assert_redirected_to new_session_path

    patch :update, params: @update_params

    assert_redirected_to new_password_path
  end

  test 'should not update password if token has expired' do
    travel 25.hours

    patch :update, params: @update_params

    assert_redirected_to new_password_path
  end
end
