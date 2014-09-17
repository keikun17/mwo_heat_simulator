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

  def self.pre_format(weapons_json_collection)
    @weapons = self.get_json

    @weapons.collect do |weapon|
      damage = weapon.damage
      damage = weapon.damage * weapon.num_per_shot if weapon.num_per_shot
      {
        weapon.weapon_id.to_s => {
          name: weapon.name,
          damage: damage,
          heat: weapon.heat
        }
      }
    end
    # [
    #       {"1000" => {name: 'AutoCannon20', damage: 20, heat: 6}},
    #       {"1003" => {name: 'SmallLaser', damage: 3, heat: 2}},
    #       {"1203" => {name: 'ClanLB20XAutoCannon', damage: 20, heat: 6}}
    # ]
  end
end
