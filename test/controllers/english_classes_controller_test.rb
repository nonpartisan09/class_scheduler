require 'test_helper'

class EnglishClassesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @english_class = english_classes(:one)
  end

  test "should get index" do
    get english_classes_url
    assert_response :success
  end

  test "should get new" do
    get new_english_class_url
    assert_response :success
  end

  test "should create english_class" do
    assert_difference('EnglishClass.count') do
      post english_classes_url, params: { english_class: { class_date: @english_class.class_date, class_time: @english_class.class_time } }
    end

    assert_redirected_to english_class_url(EnglishClass.last)
  end

  test "should show english_class" do
    get english_class_url(@english_class)
    assert_response :success
  end

  test "should get edit" do
    get edit_english_class_url(@english_class)
    assert_response :success
  end

  test "should update english_class" do
    patch english_class_url(@english_class), params: { english_class: { class_date: @english_class.class_date, class_time: @english_class.class_time } }
    assert_redirected_to english_class_url(@english_class)
  end

  test "should destroy english_class" do
    assert_difference('EnglishClass.count', -1) do
      delete english_class_url(@english_class)
    end

    assert_redirected_to english_classes_url
  end
end
