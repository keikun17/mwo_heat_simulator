require 'spec_helper'

describe WeaponExtractor do

  describe ".get_json", vcr: {cassette_name: 'load_weapons'} do
    it "extracts to file" do
      expect(described_class.get_json).to_not be_empty
    end
  end

  describe ".write(filepath)" do
    let(:filepath) { "#{Dir.pwd}/test_extracted/extracted.js" }

    it "extracts to file" # do
    #   expect(File.exists?(filepath)).to eq(false)
    #   expect(described_class.get_json(filepath)).to_not be_empty
    # end
  end

  describe ".pre_format", vcr: {cassette_name: 'load_weapons_2'} do
    subject {described_class.pre_format(weapon_collection)}
    let(:weapon_collection) { described_class.get_json }

    it "formats the weapon data" do
      expect(subject).
        to include(
          {"1000" => {name: 'AutoCannon20', damage: 20, heat: 6}},
          {"1003" => {name: 'SmallLaser', damage: 3, heat: 2}},
          {"1203" => {name: 'ClanLB20XAutoCannon', damage: 20, heat: 6}}
      )
    end
  end

end
