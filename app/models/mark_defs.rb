# frozen_string_literal: true

class MarkDefs
  attr_reader :defs

  def initialize(defs)
    @defs = defs
  end

  def by_key(key)
    @defs.find { |definition| definition["_key"] == key }
  end
end
