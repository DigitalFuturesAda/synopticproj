import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/ui/components/modules/player/Player.vue'
import {FileTransformer} from '@/core/audio/FileTransformer';
import {AlbumSingleton} from '@/core/audio/AlbumSingleton';

describe('Player.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})

describe("passes", () => {
  it("i dont know", () => {
    new FileTransformer().parseAlbums().then(parsedResponse => {
      expect(parsedResponse[""])
    });
  })
})