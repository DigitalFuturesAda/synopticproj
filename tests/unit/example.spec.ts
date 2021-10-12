import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/ui/components/modules/player/AudioController.vue'
import {AudioTransformer} from '@/core/audio/AudioTransformer';
import {AlbumSingleton} from '@/core/audio/AlbumSingleton';

describe('AudioController.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})

// describe("passes", () => {
//   it("i dont know", () => {
//     new AudioTransformer().parseAlbums().then(parsedResponse => {
//       expect(parsedResponse[""])
//     });
//   })
// })