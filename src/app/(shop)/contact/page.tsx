import React from 'react'
import Title from '@/components/common/Title'
import Image from 'next/image';
import NewsletterBox from "@/components/common/NewsletterBox";

const Contact = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8'>
      <div className=' text-2xl text-center pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className=' my-10 flex felx-col md:flex-row justify-center gap-10 mb-28'>
        <Image
         src="/contact_img.png"
         className=' w-full md:max-w-[480px]'
          alt="Contact image"
          width={480}
          height={300}
           />
        <div className=' flex flex-col justify-center gap-6 items-start '>
           <p className=' font-semibold text-sl text-gray-600'>Our Coze Store</p>
           <p className=' text-gray-500'>Phnom Penh Cambodaia <br />
           19F,CharAmpor, PP</p>
           <p className=' text-gray-500'>Tel:(088)3386537 <br />
           Email:HengVanreuth@gmail.com</p>
           <p className=' font-semibold text-sl text-gray-600'>Careers at Forever</p>
           <p className=' text-gray-500'>Learn more about our teams and job openings.</p>
           <button className=' border text-black px-8 py-4 text:sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>

        </div>

      </div>
      <NewsletterBox/>
    </div>
  )
}

export default Contact