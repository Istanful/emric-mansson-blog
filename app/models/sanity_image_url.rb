# frozen_string_literal: true

class SanityImageUrl
  class << self
    def for(reference,
           project_id = SanityRuby.configuration.project_id,
           dataset = SanityRuby.configuration.dataset)
      asset_type, id, size, file_type = reference.split('-')
      suffix = "#{id}-#{size}.#{file_type}"
      "https://cdn.sanity.io/#{asset_type.pluralize}/#{project_id}/#{dataset}/#{suffix}"
    end
  end
end
