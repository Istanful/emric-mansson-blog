# frozen_string_literal: true

require Rails.root.join("spec/helpers/mock_sanity_ruby")

class PostsController < ApplicationController
  def index
    @posts = PostRepository.new(MockSanityRuby).public
  end
end
