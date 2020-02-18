# frozen_string_literal: true

module AuthorHelper
  def author(name)
    image_tag "author-#{name}.jpg",
              class: 'rounded-full w-48 mb-5 border-4 -mt-32'
  end
end
