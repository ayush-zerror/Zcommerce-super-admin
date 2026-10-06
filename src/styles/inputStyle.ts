export const getInputClasses = (className = "") => ({
  input: `
    bg-transparent
    h-full
    outline-none
  `,
  inputWrapper: `
    w-full
    min-h-9
    h-9
    rounded-md
    bg-[#FAFAFA]
    border
    border-[#BED2F1]
    !shadow-none
    z-10
    ${className}

    hover:!bg-[#E5F5FF]
    hover:!border-[#116DFE]

    data-[hover=true]:!bg-[#E5F5FF]
    data-[hover=true]:!border-[#116DFE]

    data-[focus=true]:!border-[#116DFE]
    data-[focus-visible=true]:!border-[#116DFE]

    data-[focus=true]:ring-1
    data-[focus=true]:ring-[#BED2F1]
    data-[focus=true]:ring-offset-1
    data-[focus=true]:ring-offset-transparent
    data-[focus=true]:!bg-[#FFFFFF]

    data-[focus-visible=true]:ring-1
    data-[focus-visible=true]:ring-[#BED2F1]
    data-[focus-visible=true]:ring-offset-1
    data-[focus-visible=true]:ring-offset-transparent

    data-[focus=true]:hover:!bg-[#FFFFFF]
    data-[focus=true]:hover:!border-[#116DFE]
    data-[focus=true]:data-[hover=true]:!bg-[#FFFFFF]
    data-[focus=true]:data-[hover=true]:!border-[#116DFE]
    group-data-[focus=true]:hover:!bg-[#FFFFFF]
    group-data-[focus=true]:hover:!border-[#116DFE]
    group-data-[focus=true]:data-[hover=true]:!bg-[#FFFFFF]
    group-data-[focus=true]:data-[hover=true]:!border-[#116DFE]

    data-[invalid=true]:!border-red-500
  `,
  label: "text-sm font-medium w-full",
});


export const getSearchInputClasses = (className = "") => ({
  inputWrapper: `
    rounded-md
    bg-[#FAFAFA]
    border border-[#BED2F1]
    min-h-9 h-9
    !shadow-none
    ${className}

    hover:!bg-[#D5EBFD]
    hover:ring-1
    hover:ring-[#BED2F1]
    hover:ring-offset-1
    hover:ring-offset-transparent
    hover:!border-[#116DFE]

    data-[hover=true]:!bg-[#D5EBFD]
    data-[hover=true]:ring-1
    data-[hover=true]:ring-[#BED2F1]
    data-[hover=true]:ring-offset-1
    data-[hover=true]:ring-offset-transparent
    data-[hover=true]:!border-[#116DFE]

    data-[focus=true]:!border-[#116DFE]
    data-[focus-visible=true]:!border-[#116DFE]
    group-data-[focus=true]:!border-[#116DFE]

    data-[focus=true]:ring-1
    data-[focus=true]:ring-[#BED2F1]
    data-[focus=true]:ring-offset-1
    data-[focus=true]:ring-offset-transparent
    data-[focus=true]:!bg-[#FFFFFF]

    data-[focus-visible=true]:ring-1
    data-[focus-visible=true]:ring-[#BED2F1]
    data-[focus-visible=true]:ring-offset-1
    data-[focus-visible=true]:ring-offset-transparent

    group-data-[focus=true]:ring-1
    group-data-[focus=true]:ring-[#BED2F1]
    group-data-[focus=true]:ring-offset-1
    group-data-[focus=true]:ring-offset-transparent
    group-data-[focus=true]:!bg-[#FFFFFF]

    data-[focus=true]:hover:!bg-[#FFFFFF]
    data-[focus=true]:hover:!border-[#116DFE]
    data-[focus=true]:data-[hover=true]:!bg-[#FFFFFF]
    data-[focus=true]:data-[hover=true]:!border-[#116DFE]
    group-data-[focus=true]:data-[hover=true]:!bg-[#FFFFFF]
    group-data-[focus=true]:data-[hover=true]:!border-[#116DFE]
  `,
  input: `
    bg-transparent
    h-full
    outline-none
  `,
  label: "text-sm font-medium",
});

/** Same hover/focus behavior as getInputClasses, for dark surfaces (e.g. topbar). */
export const getDarkSearchInputClasses = (className = "") => ({
  inputWrapper: `
    !rounded-full
    min-h-9 h-9
    !shadow-none
    !bg-[#3a3a3a]
    !border !border-[#3a3a3a]
    !text-white
    ${className}

    hover:!bg-[#454545]
    hover:!border-[#116DFE]

    data-[hover=true]:!bg-[#454545]
    data-[hover=true]:!border-[#116DFE]

    data-[focus=true]:!border-[#116DFE]
    data-[focus-visible=true]:!border-[#116DFE]
    group-data-[focus=true]:!border-[#116DFE]

    data-[focus=true]:ring-1
    data-[focus=true]:ring-[#BED2F1]
    data-[focus=true]:ring-offset-1
    data-[focus=true]:ring-offset-transparent
    data-[focus=true]:!bg-[#454545]

    data-[focus-visible=true]:ring-1
    data-[focus-visible=true]:ring-[#BED2F1]
    data-[focus-visible=true]:ring-offset-1
    data-[focus-visible=true]:ring-offset-transparent

    group-data-[focus=true]:ring-1
    group-data-[focus=true]:ring-[#BED2F1]
    group-data-[focus=true]:ring-offset-1
    group-data-[focus=true]:ring-offset-transparent
    group-data-[focus=true]:!bg-[#454545]

    data-[focus=true]:hover:!bg-[#454545]
    data-[focus=true]:hover:!border-[#116DFE]
    data-[focus=true]:data-[hover=true]:!bg-[#454545]
    data-[focus=true]:data-[hover=true]:!border-[#116DFE]
    group-data-[focus=true]:hover:!bg-[#454545]
    group-data-[focus=true]:hover:!border-[#116DFE]
    group-data-[focus=true]:data-[hover=true]:!bg-[#454545]
    group-data-[focus=true]:data-[hover=true]:!border-[#116DFE]
  `,
  input: `
    bg-transparent
    h-full
    outline-none
    text-sm
    !text-white
    placeholder:!text-white/45
    [&::-webkit-search-cancel-button]:cursor-pointer
    [&::-webkit-search-cancel-button]:appearance-none
    [&::-webkit-search-cancel-button]:h-3.5
    [&::-webkit-search-cancel-button]:w-3.5
    [&::-webkit-search-cancel-button]:bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222.5%22 stroke-linecap=%22round%22%3E%3Cpath d=%22M18 6L6 18M6 6l12 12%22/%3E%3C/svg%3E')]
    [&::-webkit-search-cancel-button]:bg-center
    [&::-webkit-search-cancel-button]:bg-no-repeat
    [&::-webkit-search-cancel-button]:bg-contain
  `,
  label: "text-sm font-medium",
});


export const getDropdownClasses = (className = "") => ({
  trigger: `
   ${className}
      w-full rounded-md
      bg-[#FAFAFA]
      border border-[#BED2F1]
      py-0 min-h-9 h-9
      !shadow-none

      hover:!bg-[#D5EBFD]

      data-[focus=true]:!border-[#116DFE]
      data-[focus-visible=true]:!border-[#116DFE]
      data-[open=true]:!border-[#116DFE]

      data-[open=true]:ring-1
      data-[open=true]:ring-[#BED2F1]
      data-[open=true]:ring-offset-1
      data-[open=true]:ring-offset-transparent
      data-[open=true]:!bg-[#E5F5FF]

      data-[focus-visible=true]:ring-1
      data-[focus-visible=true]:ring-[#BED2F1]
      data-[focus-visible=true]:ring-offset-1
      data-[focus-visible=true]:ring-offset-transparent
    `,
  label: "text-sm font-medium",
});
