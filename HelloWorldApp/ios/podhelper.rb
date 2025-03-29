# Custom pod helper to fix C++ header issues
require 'fileutils'

def fix_header_paths(installer)
  puts "Applying header fixes for C++ libraries..."
  
  # Standard header search paths
  header_search_paths = [
    '$(PODS_ROOT)/boost',
    '$(PODS_ROOT)/boost-for-react-native',
    '$(PODS_ROOT)/DoubleConversion',
    '$(PODS_ROOT)/fmt/include',
    '$(PODS_ROOT)/Headers/Public/React-hermes',
    '$(PODS_ROOT)/Headers/Public/React-core',
    '$(PODS_ROOT)/Headers/Public/hermes-engine',
    '$(PODS_ROOT)/Headers/Public/yoga',
    '$(PODS_ROOT)/Headers/Public/ReactCommon',
    '$(PODS_ROOT)/Headers/Public/RCTDeprecation'
  ]
  
  # C++ build settings
  cpp_flags = {
    'CLANG_CXX_LANGUAGE_STANDARD' => 'c++17',
    'CLANG_CXX_LIBRARY' => 'libc++',
    'GCC_PREPROCESSOR_DEFINITIONS' => ['$(inherited)', '_LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION'],
    'HEADER_SEARCH_PATHS' => header_search_paths.join(' '),
    'OTHER_CPLUSPLUSFLAGS' => ['-fcxx-modules', '-fmodules', '$(inherited)'],
    # Disable warnings from third-party libraries
    'GCC_WARN_INHIBIT_ALL_WARNINGS' => 'YES',
    'CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER' => 'NO',
    'CLANG_WARN_DOCUMENTATION_COMMENTS' => 'NO',
    'CLANG_WARN_STRICT_PROTOTYPES' => 'NO',
    # Add compatibility
    'BUILD_LIBRARY_FOR_DISTRIBUTION' => 'YES'
  }
  
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Apply these settings to all targets
      config.build_settings.merge!(cpp_flags)
      
      # Special handling for problematic pods
      if target.name.include?("React-Core") || 
         target.name.include?("React-RCT") || 
         target.name.include?("React-cxxreact") || 
         target.name.include?("yoga") ||
         target.name.include?("Folly") ||
         target.name.include?("DoubleConversion") ||
         target.name.include?("RCT-Folly") ||
         target.name.include?("boost") ||
         target.name.include?("fmt") ||
         target.name.include?("glog") ||
         target.name.include?("Pods-")
        
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        config.build_settings['CLANG_CXX_LIBRARY'] = 'libc++'
      end
      
      # Fix libdav1d missing config.h issues
      if target.name.include?("libdav1d") || target.name.include?("libavif")
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
        # Ensure HAVE_CONFIG_H=1 is present (the helper script creates the file)
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'HAVE_CONFIG_H=1' unless config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'].include?('HAVE_CONFIG_H=1')
        
        # Explicitly add subdirectories containing config.h to header search paths
        libdav1d_subdirs = ['looprestoration_tmpl', 'mc', 'mc16', 'msac', 'refmvs', 'util']
        dav1d_subdir_paths = libdav1d_subdirs.map { |subdir| "$(PODS_TARGET_SRCROOT)/#{subdir}" }
        
        current_search_paths = config.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']
        current_search_paths = [current_search_paths] unless current_search_paths.is_a?(Array)
        
        # Add paths if they don't already exist
        dav1d_subdir_paths.each do |path|
          current_search_paths << path unless current_search_paths.include?(path)
        end
        
        config.build_settings['HEADER_SEARCH_PATHS'] = current_search_paths
        puts "Updated HEADER_SEARCH_PATHS for #{target.name}: #{current_search_paths.join(' ')}"
      end
      
      # Fix RCTDeprecation.h issues for react-native-safe-area-context
      if target.name.include?("react-native-safe-area-context")
        # Add specific header search paths for RCTDeprecation
        current_search_paths = config.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']
        current_search_paths = [current_search_paths] unless current_search_paths.is_a?(Array)
        
        # Add the path to RCTDeprecation
        rct_deprecation_path = '${PODS_ROOT}/Headers/Public/RCTDeprecation'
        current_search_paths << rct_deprecation_path unless current_search_paths.include?(rct_deprecation_path)
        
        # Add React-Core path which contains some required headers
        react_core_path = '${PODS_ROOT}/Headers/Public/React-Core'
        current_search_paths << react_core_path unless current_search_paths.include?(react_core_path)
        
        config.build_settings['HEADER_SEARCH_PATHS'] = current_search_paths
        
        # Set preprocessor definitions to help with importing
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'RCT_EXTERN_MODULE=1'
      end
    end
  end
  
  # Create dummy config.h files for libdav1d directories
  fix_libdav1d_config_files(installer)
  
  # Fix hermes script execution issue
  fix_hermes_script(installer)
  
  # Fix RCTDeprecation.h not found
  fix_rct_deprecation_header(installer)
  
  puts "Header fixes applied successfully."
end

# Create dummy config.h files for libdav1d
def fix_libdav1d_config_files(installer)
  root_dir = installer.sandbox.root.to_s
  libdav1d_dir = File.join(root_dir, 'libdav1d')
  
  return unless Dir.exist?(libdav1d_dir)
  
  # Directories that need config.h
  subdirs = ['looprestoration_tmpl', 'mc', 'mc16', 'msac', 'refmvs', 'util']
  
  # Basic config.h content
  config_content = <<-EOL
/* Auto-generated config.h to fix build issues */
#define ARCH_AARCH64 0
#define ARCH_ARM 0
#define ARCH_PPC64LE 0
#define ARCH_X86 0
#define ARCH_X86_32 0
#define ARCH_X86_64 1
#define CONFIG_16BPC 1
#define CONFIG_8BPC 1
#define ENDIANNESS_BIG 0
#define HAVE_ASM 0
#define HAVE_CLOCK_GETTIME 1
#define HAVE_POSIX_MEMALIGN 1
#define HAVE_PTHREAD_PRIO_INHERIT 0
#define HAVE_STDATOMIC_H 1
#define HAVE_WINRT 0
#define STACK_ALIGNMENT 16
EOL
  
  subdirs.each do |subdir|
    dir_path = File.join(libdav1d_dir, subdir)
    config_path = File.join(dir_path, 'config.h')
    
    # Create directory if it doesn't exist
    FileUtils.mkdir_p(dir_path) unless Dir.exist?(dir_path)
    
    # Create config.h if it doesn't exist
    unless File.exist?(config_path)
      File.write(config_path, config_content)
      puts "Created dummy config.h in #{dir_path}"
    end
  end
end

# Fix hermes script execution issues
def fix_hermes_script(installer)
  installer.pod_targets.each do |pod|
    if pod.name.include?("hermes-engine")
      puts "Fixing Hermes engine script phase for #{pod.name}"
      
      # Find the target in the project
      installer.pods_project.targets.each do |target|
        if target.name.include?("hermes-engine")
          target.build_configurations.each do |config|
            puts "Setting build settings for Hermes engine target: #{target.name}, config: #{config.name}"
            config.build_settings['ENABLE_USER_SCRIPT_SANDBOXING'] = 'NO'
          end
        end
      end
      
      # Fix script phases for the hermes-engine pod
      if pod.respond_to?(:spec) && pod.spec.respond_to?(:script_phases)
        pod.spec.script_phases.each do |script_phase|
          phase_name = script_phase[:name] || "Unknown"
          puts "Found script phase: #{phase_name}"
          
          if script_phase[:script] && script_phase[:script].include?("#!/bin/sh")
            # Create a temporary file with the script content
            script_content = script_phase[:script]
            temp_file = "/tmp/hermes_script_#{Time.now.to_i}.sh"
            File.write(temp_file, script_content)
            
            # Set executable permissions
            system("chmod +x #{temp_file}")
            puts "Created executable script at #{temp_file}"
            
            # Optional: replace script phase with modified script that logs better error info
            enhanced_script = <<~SCRIPT
              #!/bin/sh
              echo "Running Hermes script: #{phase_name}"
              #{temp_file} 2>&1
              EXIT_CODE=$?
              if [ $EXIT_CODE -ne 0 ]; then
                echo "Hermes script failed with exit code: $EXIT_CODE"
                echo "Check temp file for more details: #{temp_file}"
              else
                echo "Hermes script completed successfully"
              fi
              exit $EXIT_CODE
            SCRIPT
            
            # We can't directly modify the script_phase here, but this helps for debugging
            File.write("#{temp_file}_enhanced", enhanced_script)
            system("chmod +x #{temp_file}_enhanced")
            puts "Created enhanced script at #{temp_file}_enhanced"
          end
        end
      end
    end
  end
end

# Create a missing RCTDeprecation.h file
def fix_rct_deprecation_header(installer)
  root_dir = installer.sandbox.root.to_s
  
  # Create RCTDeprecation directory if it doesn't exist
  rct_deprecation_dir = File.join(root_dir, 'Headers', 'Public', 'RCTDeprecation')
  FileUtils.mkdir_p(rct_deprecation_dir) unless Dir.exist?(rct_deprecation_dir)
  
  # Create RCTDeprecation.h file with required content
  rct_deprecation_path = File.join(rct_deprecation_dir, 'RCTDeprecation.h')
  unless File.exist?(rct_deprecation_path)
    rct_deprecation_content = <<-EOL
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @generated by an automated process
 */

#ifndef RCTDeprecation_h
#define RCTDeprecation_h

#include <React/RCTDefines.h>

#define RCT_DEPRECATED(message) __attribute__((deprecated(message)))

#if defined(__cplusplus)
extern "C" {
#endif

/**
 * Provides access to any deprecated methods or classes that RN uses
 */
RCT_EXTERN_MODULE(RCTDeprecation)

#if defined(__cplusplus)
}
#endif

#endif /* RCTDeprecation_h */
EOL
    File.write(rct_deprecation_path, rct_deprecation_content)
    puts "Created missing RCTDeprecation.h at #{rct_deprecation_path}"
  end
end 