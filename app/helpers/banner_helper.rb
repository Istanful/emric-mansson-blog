# frozen_string_literal: true

module BannerHelper
  def banner(url)
    content_tag :div,
                "",
                style: "background-image: url(#{url})",
                class: 'h-56 w-full bg-center'
  end
end
