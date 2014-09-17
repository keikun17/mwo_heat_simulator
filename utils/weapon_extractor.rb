class WeaponExtractor
  def self.write(filepath, payload)
    dir = filepath.split('/')
    dir.pop
    dir = dir.join('/')

    Dir.mkdir(dir) unless Dir.exists?(dir)
    FileUtils.rm(filepath) if File.exists?(filepath)
    File.write(filepath, payload)
  end

  def self.get_json
    MWO::Weapon.all
  end

  def self.pre_format(weapons_json_collection, format = :hash)

    weapons = {}
    get_json.each do |weapon|
      damage = weapon.damage
      damage = weapon.damage * weapon.num_per_shot if weapon.num_per_shot
      weapons[weapon.weapon_id.to_s] = {
        name: weapon.name,
        damage: damage,
        heat: weapon.heat
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
