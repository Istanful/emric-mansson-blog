# frozen_string_literal: true

require Rails.root.join("spec/helpers/mock_sanity_ruby")

class PostsController < ApplicationController
  BACKEND = SanityRuby

  def index
    @posts = PostRepository.new(BACKEND).public
  end

  def show
    @post = PostRepository.new(BACKEND).find_by_slug(params[:slug])
  end
end
