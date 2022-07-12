require 'test_helper'

class Web::SessionControllerTest < ActionDispatch::IntegrationTest
  test 'should get new' do
    get new_session_path
    assert_response :success
  end
end
