<h1 class="mb-4">Settings</h1>
        <!-- Settings Tabs Navigation -->
        <ul class="nav nav-tabs" id="settingsTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link active"
                    id="account-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#account"
                    type="button"
                    role="tab"
                    aria-controls="account"
                    aria-selected="true">
                    Account
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#profile"
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false">
                    Profile
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    id="preferences-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#preferences"
                    type="button"
                    role="tab"
                    aria-controls="preferences"
                    aria-selected="false">
                    Preferences
                </button>
            </li>
        </ul>
        <!-- Settings Tabs Content -->
        <div class="tab-content py-4" id="settingsTabsContent">
            <!-- Account Settings -->
            <div
                class="tab-pane fade show active"
                id="account"
                role="tabpanel"
                aria-labelledby="account-tab">
                <h3>Account Settings</h3>
                <p class="text-muted">
                    Manage your account information and credentials
                </p>
                <div class="row g-4 mt-2">
                    <div class="col-md-6">
                        <div class="card card-no-hover">
                            <div class="card-body">
                                <h5 class="card-title">
                                    Personal Information
                                </h5>
                                <form id="account-info-form">
                                    <div class="mb-3">
                                        <label
                                            for="email"
                                            class="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            class="form-control"
                                            id="email"
                                            placeholder="your.email@example.com"
                                            required />
                                    </div>
                                    <div class="mb-3">
                                        <label
                                            for="phone"
                                            class="form-label">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            class="form-control"
                                            id="phone"
                                            placeholder="Enter your phone number" />
                                    </div>
                                    <div class="mb-3">
                                        <label
                                            for="gender"
                                            class="form-label">
                                            Gender
                                        </label>
                                        <select
                                            class="form-select"
                                            id="gender">
                                            <option
                                                selected
                                                disabled>
                                                Select gender
                                            </option>
                                            <option value="male">
                                                Male
                                            </option>
                                            <option value="female">
                                                Female
                                            </option>
                                            <option value="other">
                                                Other
                                            </option>
                                            <option
                                                value="prefer-not-to-say">
                                                Prefer not to say
                                            </option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        class="btn btn-primary">
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card card-no-hover">
                            <div class="card-body">
                                <h5 class="card-title">Password</h5>
                                <div class="mb-3">
                                    <label
                                        for="current-password"
                                        class="form-label">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        id="current-password" />
                                </div>
                                <div class="mb-3">
                                    <label
                                        for="new-password"
                                        class="form-label">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        id="new-password" />
                                </div>
                                <div class="mb-3">
                                    <label
                                        for="confirm-password"
                                        class="form-label">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        class="form-control"
                                        id="confirm-password" />
                                </div>
                                <button
                                    id="update-password-btn"
                                    type="button"
                                    class="btn btn-primary">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Profile Settings -->
            <div
                class="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab">
                <h3>Profile Settings</h3>
                <p class="text-muted">
                    Customize your public profile information
                </p>
                <div class="row g-4 mt-2">
                    <div class="col-md-6">
                        <div class="card card-no-hover">
                            <div class="card-body">
                                <h5 class="card-title">
                                    Profile Information
                                </h5>
                                <form id="profile-form">
                                    <div class="mb-4">
                                        <label
                                            for="display-name"
                                            class="form-label">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id="display-name"
                                            placeholder="Your display name"
                                            required />
                                        <small
                                            class="form-text text-muted">
                                            This is how your name
                                            will appear to other
                                            users.
                                        </small>
                                    </div>
                                    <div class="mb-4">
                                        <label
                                            for="bio"
                                            class="form-label">
                                            Bio
                                        </label>
                                        <textarea
                                            class="form-control"
                                            id="bio"
                                            rows="4"
                                            placeholder="Tell us about yourself"></textarea>
                                        <small
                                            class="form-text text-muted">
                                            A brief description
                                            about yourself.
                                        </small>
                                    </div>
                                    <button
                                        type="submit"
                                        class="btn btn-primary">
                                        Update Profile
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card card-no-hover">
                            <div class="card-body">
                                <h5 class="card-title">
                                    Profile Picture
                                </h5>
                                <div class="text-center mb-3">
                                    <div
                                        class="position-relative d-inline-block">
                                        <div
                                            class="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                            style="
                                                width: 150px;
                                                height: 150px;
                                                overflow: hidden;
                                            ">
                                            <i
                                                class="bi bi-person"
                                                style="font-size: 5rem;"></i>
                                        </div>
                                    </div>
                                </div>
                                <form id="profile-image-form">
                                    <div class="mb-3">
                                        <label
                                            for="profile-image"
                                            class="form-label">
                                            Upload New Image
                                        </label>
                                        <input
                                            class="form-control"
                                            type="file"
                                            id="profile-image"
                                            accept="image/*" />
                                        <small
                                            class="form-text text-muted">
                                            Recommended size:
                                            300x300 pixels
                                        </small>
                                    </div>
                                    <button
                                        type="submit"
                                        class="btn btn-primary">
                                        Upload Picture
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Preferences Settings -->
            <div
                class="tab-pane fade"
                id="preferences"
                role="tabpanel"
                aria-labelledby="preferences-tab">
                <h3>Preferences</h3>
                <p class="text-muted">
                    Coming soon - Customize your app experience
                </p>
                <div class="card card-no-hover">
                    <div class="card-body text-center py-5">
                        <i
                            class="bi bi-gear"
                            style="font-size: 3rem"></i>
                        <h5 class="mt-3">
                            Preferences will be available soon
                        </h5>
                        <p class="text-muted">
                            We're working on adding customization
                            options for your experience.
                        </p>
                    </div>
                </div>
            </div>
        </div>
