# frozen_string_literal: true

module NavigationHelper
  def nav_item(text, path)
    content_tag 'li', class: 'px-5 py-5' do
      nav_link text, path
    end
  end

  def nav_link(text, path)
    link_to text, path, class: active_link_class(path)
  end

  def active_link_class(path)
    current_uri = request.env['PATH_INFO']
    return 'text-blue' if current_uri == path

    'text-gray-900'
  end
end
