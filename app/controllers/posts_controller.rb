# frozen_string_literal: true

require Rails.root.join("spec/helpers/mock_sanity_ruby")

class PostsController < ApplicationController
  BACKEND = MockSanityRuby

  def index
    @posts = PostRepository.new(BACKEND).public
  end

  def show
    @post = PostRepository.new(BACKEND).find_by_slug(params[:slug])

    return render 'not_founds/show' if @post.blank?
  end
end
