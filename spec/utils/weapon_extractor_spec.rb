require 'spec_helper'

describe WeaponExtractor do

  describe ".get_json", vcr: {cassette_name: 'load_weapons'} do
    it "extracts to file" do
      expect(described_class.get_json).to_not be_empty
    end
  end

  describe ".write(filepath)", vcr: {cassette_name: 'load_weapons_2' } do
    context "payload are weapons and the format is yaml" do
      let(:filepath) { "#{Dir.pwd}/test_extracted/extracted.js" }
      let(:format) {:yaml}
      let(:payload) { described_class.pre_format(described_class.get_json, format: format) }

      it "extracts to file" do
        described_class.write(filepath, payload)
        expect(File.exists?(filepath)).to eq(true)

        f = File.read(filepath)
        expect(f).to_not be_empty
      end

    end
  end

  describe ".pre_format", vcr: {cassette_name: 'load_weapons_3'} do
    subject {described_class.pre_format(weapon_collection, format)}
    let(:weapon_collection) { described_class.get_json }

    context "format is hash" do
      let(:format) { :hash }
      it "formats the weapon data" do
        expect(subject).
          to include(
            {"1000" => {name: 'AutoCannon20', damage: 20, heat: 6}},
            {"1003" => {name: 'SmallLaser', damage: 3, heat: 2}},
            {"1203" => {name: 'ClanLB20XAutoCannon', damage: 20, heat: 6}}
        )
      end
    end

    context "Format is yaml" do
      let(:format) { :yaml }
      it "should be a yaml file" do
        expect(YAML.load(subject)).to_not be_empty
      end
    end
  end

end
