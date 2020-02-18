# frozen_string_literal: true

module ButtonHelper
  DEFAULT_CLASSES = %w[rounded-md px-3 py-2 transition-all duration-150 ease-out]

  def outlined_button(text, path)
    link_to text, path, class: [
      *DEFAULT_CLASSES,
      *%w[border border-blue text-blue hover:bg-blue hover:text-white]
    ] * ' '
  end
end
