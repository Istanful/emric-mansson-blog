# frozen_string_literal: true

module ContainerHelper
  def container
    content_tag :div, class: 'container p-8' do
      yield
    end
  end
end
