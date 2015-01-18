class WeaponExtractor

  def self.get_json
    MWO::Weapon.all
  end

  def self.write(filepath, payload)
    dir = filepath.split('/')
    dir.pop
    dir = dir.join('/')

    Dir.mkdir(dir) unless Dir.exists?(dir)
    FileUtils.rm(filepath) if File.exists?(filepath)
    File.write(filepath, payload)
  end

  def self.get_cooldown(weapons, format = :json)
    new_weapons = {}
    get_json.each do |weapon|
      new_weapons[weapon.weapon_id.to_s] = weapon.cooldown.to_s + 's'
    end

    return reformat(new_weapons, format)
  end

  def self.get_ghost_heat_groupings(weapons, format = :json)
    weapon_groups = {}

    weapons.each do |weapon|
      if weapon.heat_penalty_id
        weapon_groups[weapon.heat_penalty_id.to_s] ||= {weapon_ids: [], ghost_heat_trigger: weapon.minheatpenaltylevel.to_s}
        weapon_groups[weapon.heat_penalty_id.to_s][:weapon_ids] << weapon.weapon_id.to_s
      end
    end

    return reformat(weapon_groups, format)
  end

  def self.pre_format(weapons, format = :hash)

    new_weapons = {}
    get_json.each do |weapon|
      damage = weapon.damage

      if !weapon.num_firing.nil?
        damage = damage * weapon.num_firing
      end

      if !weapon.num_per_shot.nil?
        damage = damage * weapon.num_per_shot
      end

      new_weapons[weapon.weapon_id.to_s] = {
        name: weapon.name,
        damage: damage,
        heat: weapon.heat,
        multiplier: weapon.heatpenalty,
        ghost_heat_group: weapon.heat_penalty_id,
        ghost_heat_trigger: weapon.minheatpenaltylevel,
        cooldown: weapon.cooldown
      }

    end


    return reformat(new_weapons, format)

  end

  def self.reformat(formattable, format)
    case format
      when :json
        JSON.generate(formattable)
      when :yaml
        formattable.to_yaml
      else
        formattable
      end
  end
end
