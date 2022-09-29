require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  setup do
    @user = create(:user)
    @task = create(:task, author: @user)
    @params = { user: @user, task: @task }
  end

  test 'task created' do
    email = UserMailer.with(@params).task_created

    assert_emails(1) { email.deliver_now }
    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'New Task Created', email.subject
    assert email.body.to_s.include?("Task #{@task.id} was created")
  end

  test 'task updated' do
    email = UserMailer.with(@params).task_updated

    assert_emails(1) { email.deliver_now }
    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Task Was Updated', email.subject
    assert email.body.to_s.include?("Task #{@task.id} was updated")
  end

  test 'task deleted' do
    email = UserMailer.with(@params).task_deleted

    assert_emails(1) { email.deliver_now }
    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Task Was Deleted', email.subject
    assert email.body.to_s.include?("Task #{@task.id} was deleted")
  end

  test 'password reset' do
    PasswordResetService.create_password_reset_token(@user)

    params = { user: @user }
    email = UserMailer.with(params).password_reset

    assert_emails(1) { email.deliver_now }
    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [@user.email], email.to
    assert_equal 'Reset your password', email.subject
    assert email.body.to_s.include?('Reset your password')
  end
end
