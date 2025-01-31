import React from 'react';

function Form() {

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        formData.append("access_key", "0e631d90-1efb-42a3-b147-578dd4ab9dea");
    
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
    
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: json
        }).then((res) => res.json());
    
        if (res.success) {
          console.log("Success", res);
        }
    }; 
    

  return (
    <section className='flex flex-col  '>

        <form 
            onSubmit={onSubmit}
            className=' bg-stone-400 p-10 flex flex-col justify-center gap-5 '
        >
            <div className='text-stone-700 text-3xl font-semibold'>
                Get in touch
            </div>
            <div>
                <input name='name' type='text' placeholder='Enter your name' required className='bg-stone-50 p-3 rounded-xl w-full shadow-md'></input>    
            </div>
            <div>
                <input name='email' type='email' placeholder='Enter your email' required className='bg-stone-50 p-3 rounded-xl w-full shadow-md'></input>    
            </div>
            <div>
                <textarea name='message' placeholder='Enter your message' required className='bg-stone-50 p-3 rounded-xl w-full shadow-md resize-none'></textarea>    
            </div>
            <div className="flex justify-end">
              <button type='submit' className='text-stone-50 bg-red-600 py-3 px-5 rounded-xl shadow-md '>Submit</button>
            </div>
            
        </form>

    </section>
  )
}

export default Form