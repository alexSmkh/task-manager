require 'test_helper'

class Web::BoardsControllerTest < ActionDispatch::IntegrationTest
  test 'should get show' do
    get board_path
    assert_response :success
  end
end
