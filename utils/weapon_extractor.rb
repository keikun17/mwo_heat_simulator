class WeaponExtractor
  def self.write(filepath, payload)
    dir = filepath.split('/')
    dir.pop
    dir = dir.join('/')

    Dir.mkdir(dir) unless Dir.exists?(dir)
    FileUtils.rm(filepath) if File.exists?(filepath)
    File.write(filepath, payload)
  end

  def self.get_cooldown(weapons_js_collection, format = :json)
    weapons = {}
    get_json.each do |weapon|
      weapons[weapon.weapon_id.to_s] = weapon.cooldown.to_s + 's'
    end

    formatted_weapons = case format
                        when :json
                          JSON.generate(weapons)
                        when :yaml
                          weapons.to_yaml
                        else
                          weapons
                        end

    return formatted_weapons
  end

  def self.get_json
    MWO::Weapon.all
  end

  def self.pre_format(weapons_json_collection, format = :hash)

    weapons = {}
    get_json.each do |weapon|
      damage = weapon.damage

      if !weapon.num_firing.nil?
        damage = damage * weapon.num_firing
      end

      if !weapon.num_per_shot.nil?
        damage = damage * weapon.num_per_shot
      end

      weapons[weapon.weapon_id.to_s] = {
        name: weapon.name,
        damage: damage,
        heat: weapon.heat,
        multiplier: weapon.heatpenalty
      }

    end

    formatted_weapons = case format
                        when :json
                          JSON.generate(weapons)
                        when :yaml
                          weapons.to_yaml
                        else
                          weapons
                        end

    return formatted_weapons

  end
end
