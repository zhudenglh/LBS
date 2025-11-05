# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-keep public class com.facebook.react.ReactActivity
-keep public class com.facebook.react.ReactActivityDelegate
-keep public class com.facebook.react.ReactRootView
-keep public class com.facebook.react.modules.core.PermissionListener
-keep public class * extends com.facebook.react.bridge.JavaScriptModule
-keep public class * extends com.facebook.react.bridge.NativeModule
-keep public class * extends com.facebook.react.bridge.ReactContextBaseJavaModule
-keep public class * extends com.facebook.react.uimanager.ViewManager

# Hermes related
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
